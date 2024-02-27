import type { HttpResponse } from '../protocols'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (): HttpResponse => ({
  body: new Error(),
  statusCode: 500
})

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})
