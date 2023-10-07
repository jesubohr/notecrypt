export function debounce<Args extends unknown[]> (
  func: (...args: Args) => void,
  delay: number
): (...args: Args) => void {
  let timeoutId: number | undefined
  const debounced = (...args: Args): void => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => { func(...args) }, delay)
  }
  return debounced
}
