export default class UserCategory {
    static readonly VISITOR = process.env.NEXT_PUBLIC_USER_CATEGORY_VISITOR
        ? parseInt(process.env.NEXT_PUBLIC_USER_CATEGORY_VISITOR, 10)
        : 0;
    static readonly REGISTER = process.env.NEXT_PUBLIC_USER_CATEGORY_REGISTER
        ? parseInt(process.env.NEXT_PUBLIC_USER_CATEGORY_REGISTER, 10)
        : 1;

    static readonly AI = process.env.NEXT_PUBLIC_USER_CATEGORY_AI
        ? parseInt(process.env.NEXT_PUBLIC_USER_CATEGORY_AI, 10)
        : 2;
    static readonly ADMIN = process.env.NEXT_PUBLIC_USER_CATEGORY_ADMIN
        ? parseInt(process.env.NEXT_PUBLIC_USER_CATEGORY_ADMIN, 10)
        : 4;
}
