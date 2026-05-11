/** Floating tab bar — keep in sync with `app/(tabs)/_layout.tsx`. */
export const FLOATING_TAB_BAR_HEIGHT = 62;
export const FLOATING_TAB_BAR_SIDE_MARGIN = 20;
/** Gap between home indicator / screen bottom and tab bar. */
export const FLOATING_TAB_BAR_ABOVE_INSET = 10;
/** Extra space so scroll content clears the bar. */
export const FLOATING_TAB_BAR_CONTENT_GAP = 16;

export function floatingTabBarBottomOffset(safeBottom: number) {
  return safeBottom + FLOATING_TAB_BAR_ABOVE_INSET;
}

export function floatingTabBarContentPaddingBottom(safeBottom: number) {
  return floatingTabBarBottomOffset(safeBottom) + FLOATING_TAB_BAR_HEIGHT + FLOATING_TAB_BAR_CONTENT_GAP;
}
