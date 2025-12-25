import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      kurumSube: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
    kurumSube: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    kurumSube: string
  }
}

