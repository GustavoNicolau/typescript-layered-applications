import { v4 } from 'uuid'

export interface AuthorObject {
  id: string

  name: string

  email: string

  birthday: Date

  bio: string
}
export class Author {
  id: string

  name: string

  email: string

  birthday: Date

  bio: string

  constructor(properties: AuthorObject) {
    this.id = properties.id || v4()
    this.name = properties.name
    this.email = properties.email
    this.birthday = properties.birthday
    this.bio = properties.bio
  }

  get object(): AuthorObject {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      birthday: this.birthday,
      bio: this.bio
    }
  }
}
