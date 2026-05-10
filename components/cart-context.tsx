"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import type { MealAddon } from "@/lib/reserves";

const STORAGE_KEY = "reserve-meal-cart-v1";

export type CartAddonSelection = { label: string; priceNgn: number };

export type CartLine = {
  lineId: string;
  listingId: string;
  slug: string;
  title: string;
  imageUrl: string | null;
  imageTone: string;
  billingPeriod: string;
  unitPriceNgn: number;
  quantity: number;
  addonSelections: CartAddonSelection[];
};

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotalNgn: number;
  addMealLine: (input: {
    listingId: string;
    slug: string;
    title: string;
    imageUrl: string | null;
    imageTone: string;
    billingPeriod: string;
    unitPriceNgn: number;
    quantity: number;
    addonSelections: CartAddonSelection[];
    availableAddons: MealAddon[];
  }) => void;
  updateLineQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function lineTotal(line: CartLine) {
  const addons = line.addonSelections.reduce((sum, addon) => sum + addon.priceNgn, 0);
  return (line.unitPriceNgn + addons) * line.quantity;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        if (Array.isArray(parsed)) {
          setLines(parsed);
        }
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, hydrated]);

  const addMealLine = useCallback(
    (input: {
      listingId: string;
      slug: string;
      title: string;
      imageUrl: string | null;
      imageTone: string;
      billingPeriod: string;
      unitPriceNgn: number;
      quantity: number;
      addonSelections: CartAddonSelection[];
      availableAddons: MealAddon[];
    }) => {
      const normalizedAddons = input.addonSelections.filter((selection) =>
        input.availableAddons.some(
          (addon) => addon.label === selection.label && addon.priceNgn === selection.priceNgn,
        ),
      );

      setLines((current) => {
        const signature = (addons: CartAddonSelection[]) =>
          addons
            .map((item) => `${item.label}:${item.priceNgn}`)
            .sort()
            .join("|");

        const nextLine: CartLine = {
          lineId:
            typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : `line-${Date.now()}-${Math.random().toString(16).slice(2)}`,
          listingId: input.listingId,
          slug: input.slug,
          title: input.title,
          imageUrl: input.imageUrl,
          imageTone: input.imageTone,
          billingPeriod: input.billingPeriod,
          unitPriceNgn: input.unitPriceNgn,
          quantity: input.quantity,
          addonSelections: normalizedAddons,
        };

        const matchIndex = current.findIndex(
          (line) =>
            line.listingId === nextLine.listingId &&
            signature(line.addonSelections) === signature(nextLine.addonSelections),
        );

        if (matchIndex === -1) {
          return [...current, nextLine];
        }

        return current.map((line, index) =>
          index === matchIndex ? { ...line, quantity: line.quantity + nextLine.quantity } : line,
        );
      });
    },
    [],
  );

  const updateLineQuantity = useCallback((lineId: string, quantity: number) => {
    setLines((current) =>
      current
        .map((line) => (line.lineId === lineId ? { ...line, quantity: Math.max(1, quantity) } : line))
        .filter((line) => line.quantity > 0),
    );
  }, []);

  const removeLine = useCallback((lineId: string) => {
    setLines((current) => current.filter((line) => line.lineId !== lineId));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const itemCount = useMemo(() => lines.reduce((sum, line) => sum + line.quantity, 0), [lines]);
  const subtotalNgn = useMemo(() => lines.reduce((sum, line) => sum + lineTotal(line), 0), [lines]);

  const value = useMemo(
    () => ({
      lines,
      itemCount,
      subtotalNgn,
      addMealLine,
      updateLineQuantity,
      removeLine,
      clearCart,
    }),
    [lines, itemCount, subtotalNgn, addMealLine, updateLineQuantity, removeLine, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useMealCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useMealCart must be used within CartProvider");
  }

  return ctx;
}
