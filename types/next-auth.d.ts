import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
	interface Session extends DefaultSession {
		user: DefaultUser & {
			id: string;
			name: string;
			role: string;
		};
	}
	interface User extends DefaultUser {
		id: string;
		name: string;
		role: string;
	}
}

declare module 'next-auth/jwt' {
	interface JWT extends DefaultJWT {
		id: string;
		name: string;
		role: string;
	}
}
