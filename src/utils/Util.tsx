export const getElementTranslateX = (element: HTMLDivElement): number => {
  const style: CSSStyleDeclaration = window.getComputedStyle(element);
  const matrix: DOMMatrixReadOnly = new DOMMatrixReadOnly(style.transform);
  const translateX = matrix.m41;
  return translateX;
};
