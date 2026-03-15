import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convert amount in rupees to words
 * Example: 1234567.89 => "Twelve Lakh Thirty Four Thousand Five Hundred Sixty Seven and 89/100 Only"
 */
export function amountToWords(amount: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
  const scales = ['', 'Thousand', 'Lakh', 'Crore']

  function convertHundreds(num: number): string {
    let result = ''
    const hundreds = Math.floor(num / 100)
    const remainder = num % 100

    if (hundreds > 0) {
      result += ones[hundreds] + ' Hundred'
    }

    if (remainder > 0) {
      if (result) result += ' '
      if (remainder < 10) {
        result += ones[remainder]
      } else if (remainder < 20) {
        result += teens[remainder - 10]
      } else {
        const tenDigit = Math.floor(remainder / 10)
        const oneDigit = remainder % 10
        result += tens[tenDigit]
        if (oneDigit > 0) result += ' ' + ones[oneDigit]
      }
    }

    return result
  }

  if (amount === 0) return 'Zero Only'

  const parts = amount.toString().split('.')
  const integerPart = parseInt(parts[0], 10)
  const decimalPart = parts[1] ? parseInt(parts[1].padEnd(2, '0').substring(0, 2), 10) : 0

  let words = ''
  let scaleIndex = 0

  let remaining = integerPart
  const groups: number[] = []

  while (remaining > 0) {
    if (scaleIndex === 0 || scaleIndex === 1) {
      groups.push(remaining % 1000)
      remaining = Math.floor(remaining / 1000)
    } else {
      groups.push(remaining % 100)
      remaining = Math.floor(remaining / 100)
    }
    scaleIndex++
  }

  for (let i = groups.length - 1; i >= 0; i--) {
    if (groups[i] > 0) {
      words += convertHundreds(groups[i]) + ' ' + scales[i] + ' '
    }
  }

  words = words.trim()
  if (decimalPart > 0) {
    words += ' and ' + decimalPart.toString().padStart(2, '0') + '/100'
  } else {
    words += ' and 00/100'
  }
  words += ' Only'

  return words
}
