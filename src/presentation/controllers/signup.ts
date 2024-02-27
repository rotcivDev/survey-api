import type { HttpResponse, HttpRequest, Controller, EmailValidator } from '../protocols'
import { badRequest, serverError } from '../helpers/http-helper'
import { InvalidParamError, MissingParamError } from '../errors'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const REQUIRED_FIELDS = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of REQUIRED_FIELDS) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      if (httpRequest.body.password !== httpRequest.body.passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isEmailValid = this.emailValidator.isValid(httpRequest.body.email as string)
      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
      }
      return {
        statusCode: 200,
        body: 'success'
      }
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
