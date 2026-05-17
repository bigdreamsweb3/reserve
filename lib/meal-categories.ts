export const MEAL_CATEGORY_OPTIONS = [
  { value: "rice-dishes", label: "Rice menu" },
  { value: "soups-stews", label: "Soups" },
  { value: "sides-swallow", label: "Yam, plantain & beans" },
  { value: "drinks", label: "Drinks & beverages" },
  { value: "noodles-pasta", label: "Noodles & pasta" },
  { value: "grills-protein", label: "Grills & protein" },
  { value: "desserts-snacks", label: "Desserts & snacks" },
  { value: "other", label: "Other" },
] as const;

export type MealCategoryValue = (typeof MEAL_CATEGORY_OPTIONS)[number]["value"];

export const MEAL_PACKAGE_OPTIONS = [
  { value: "flexi", label: "Flexi Meals", shortLabel: "Flexi", priceNgn: 3000 },
  { value: "standard", label: "Standard Meals", shortLabel: "Standard", priceNgn: 5000 },
  { value: "executive", label: "Executive Meals", shortLabel: "Executive", priceNgn: null },
] as const;

export type MealPackageValue = (typeof MEAL_PACKAGE_OPTIONS)[number]["value"];

export function mealCategoryLabel(value: string | null | undefined) {
  if (!value) {
    return "Uncategorized";
  }

  const found = MEAL_CATEGORY_OPTIONS.find((item) => item.value === value);
  return found?.label ?? value;
}

export function mealCategorySortRank(value: string | null | undefined) {
  const order = MEAL_CATEGORY_OPTIONS.map((item) => item.value);
  const idx = value ? order.indexOf(value as MealCategoryValue) : -1;
  return idx === -1 ? order.length : idx;
}

export function mealPackageLabel(value: string | null | undefined) {
  if (!value) {
    return "Unpackaged";
  }

  const found = MEAL_PACKAGE_OPTIONS.find((item) => item.value === value);
  return found?.label ?? value;
}

export function mealPackageSortRank(value: string | null | undefined) {
  const order = MEAL_PACKAGE_OPTIONS.map((item) => item.value);
  const idx = value ? order.indexOf(value as MealPackageValue) : -1;
  return idx === -1 ? order.length : idx;
}
