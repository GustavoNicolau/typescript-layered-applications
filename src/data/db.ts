import { constants } from 'fs'
import { access, readFile, writeFile } from 'fs/promises'
import path from 'path'
import { AuthorObject, BookObject } from '../domain'

export class DB {
  static instance: DB

  #authors: Map<string, AuthorObject> = new Map()

  #books: Map<string, BookObject> = new Map()

  #dbPath: string = path.resolve(__dirname, '.db.json')

  constructor() {
    if (!DB.instance) DB.instance = this
    return DB.instance
  }

  async save() {
    return writeFile(
      this.#dbPath,
      JSON.stringify({
        authors: [...this.#authors.entries()],
        books: [...this.#books.entries()]
      })
    )
  }

  async #load() {
    const readData = await readFile(this.#dbPath, 'utf-8')
    this.#authors = new Map(Array.isArray(JSON.parse(readData).authors) ? JSON.parse(readData).authors : new Map())
    this.#books = new Map(Array.isArray(JSON.parse(readData).books) ? JSON.parse(readData).books : new Map())
  }

  async init() {
    try {
      await access(this.#dbPath, constants.F_OK)
      await this.#load()
    } catch (error) {
      await this.save()
    }
  }

  async addBook(book: BookObject) {
    this.#books.set(book.id, book)
    await this.save()
    return book
  }

  async updateBook(bookId: string, updateData: Partial<BookObject>) {
    const { id, ...currentBook } = (await this.#books.get(bookId)) || {}
    delete updateData.id
    const newBook: BookObject = { ...currentBook, ...updateData } as BookObject
    this.#books.set(bookId, newBook)
    await this.save()
    return this.getBook(bookId)
  }

  async deleteBook(id: string) {
    this.#books.delete(id)
    await this.save()
  }

  async getBook(id: string) {
    return this.#books.get(id)
  }

  async listBooks() {
    return [...this.#books.values()]
  }

  async addAuthor(author: AuthorObject) {
    this.#authors.set(author.id, author)
    await this.save()
    return author
  }

  async updateAuthor(authorId: string, updateData: Partial<AuthorObject>) {
    const { id, ...currentAuthor } = (await this.#authors.get(authorId)) || {}
    delete updateData.id
    const newAuthor: AuthorObject = { ...currentAuthor, ...updateData } as AuthorObject
    this.#authors.set(authorId, newAuthor)
    await this.save()
    return this.getAuthor(authorId)
  }

  async deleteAuthor(id: string) {
    this.#authors.delete(id)
    await this.save()
  }

  async getAuthor(id: string) {
    return this.#authors.get(id)
  }

  async listAuthors() {
    return [...this.#authors.values()]
  }
}
