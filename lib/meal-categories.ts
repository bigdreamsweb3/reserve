export const MEAL_CATEGORY_OPTIONS = [
  { value: "drinks", label: "Drinks & beverages" },
  { value: "soups-stews", label: "Soups & stews" },
  { value: "rice-dishes", label: "Fried rice, jollof & rice plates" },
  { value: "noodles-pasta", label: "Noodles & pasta" },
  { value: "grills-protein", label: "Grills & protein" },
  { value: "sides-swallow", label: "Sides & swallow" },
  { value: "desserts-snacks", label: "Desserts & snacks" },
  { value: "other", label: "Other" },
] as const;

export type MealCategoryValue = (typeof MEAL_CATEGORY_OPTIONS)[number]["value"];

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
