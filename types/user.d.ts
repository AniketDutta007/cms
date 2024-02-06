interface User {
	id: string;
	name: string;
	email: string;
	role: Role;
	verified: boolean;
	createdAt: Date;
	updatedAt: Date;
}

type Users = User[];

export { User, Users };
