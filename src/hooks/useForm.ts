import { FormEvent, useState } from 'react'

export const useForm = (initialState: any = {}) => {
  const [values, setValues] = useState(initialState)

  const reset = () => {
    setValues(initialState)
  }

  const handleInputChange = ({
    currentTarget
  }: FormEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [currentTarget.name]: currentTarget.value
    })
  }

  return [values, handleInputChange, reset]
}
