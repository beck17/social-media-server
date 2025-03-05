export interface IUser {
	firstName: string
	lastName: string
	phoneNumber: number
	password: string
	avatar?: string
	backgroundPic?: string
	birthday?: string
	friends: IUser[]
	requestFriends: IUser[]
	outgoingRequestFriends: IUser[]
}
