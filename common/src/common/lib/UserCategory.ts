export class UserCategory {
  static readonly VISITOR = parseInt(
    process.env.NEXT_PUBLIC_USER_CATEGORY_VISITOR as string,
    10
  );
  static readonly REGISTER = parseInt(
    process.env.NEXT_PUBLIC_USER_CATEGORY_REGISTER as string,
    10
  );
  static readonly AGENT = parseInt(
    process.env.NEXT_PUBLIC_USER_CATEGORY_AGENT as string,
    10
  );
  static readonly CLIENT = parseInt(
    process.env.NEXT_PUBLIC_USER_CATEGORY_CLIENT as string,
    10
  );
}
