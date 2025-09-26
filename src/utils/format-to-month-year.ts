export const formatToMonthYear = (dateString: string): string => {
  console.log(dateString)
  const date = new Date(dateString)
  const month = String(date.getMonth() + 1).padStart(2, '0') // getMonth() returns 0-11, so add 1
  const year = date.getFullYear()
  console.log(`${month}/${year}`)
  return `${month}/${year}`
}
