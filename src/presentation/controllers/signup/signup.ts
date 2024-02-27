import type { HttpResponse, HttpRequest, Controller, EmailValidator, AddAccount } from './signup-protocols'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { InvalidParamError, MissingParamError } from '../../errors'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const REQUIRED_FIELDS = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of REQUIRED_FIELDS) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isEmailValid = this.emailValidator.isValid(email as string)
      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const newAccount = await this.addAccount.add({
        name,
        email,
        password
      })

      return ok(newAccount)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
