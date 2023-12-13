/**
 * User Entity Example, NOT USE IT IN PRODUCTION.
 */
export class User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  /**
   * @param partial
   */
  constructor(partial?: Partial<User>) {
    Object.assign(this, partial);
  }
}
