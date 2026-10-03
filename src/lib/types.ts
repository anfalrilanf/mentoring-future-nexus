export type Role = 'participant' | 'admin';

export interface Profile {
	id: string;
	full_name: string | null;
	avatar_url: string | null;
	school: string | null;
	grade: string | null;
	interest: string | null;
	bio: string | null;
	role: Role;
	created_at: string;
}

export interface Mentor {
	id: string;
	name: string;
	photo_url: string | null;
	campus: string;
	major: string;
	batch_year: number | null;
	expertise: string[];
	bio: string | null;
	created_at: string;
}

export interface Program {
	id: string;
	title: string;
	description: string;
	category: string;
	mentor_id: string | null;
	schedule: string | null;
	is_active: boolean;
	created_at: string;
	mentors?: { id: string; name: string } | null;
}

export type SessionStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface MentoringSession {
	id: string;
	program_id: string | null;
	mentor_id: string | null;
	title: string;
	topic: string;
	session_date: string;
	start_time: string;
	end_time: string;
	location: string | null;
	capacity: number | null;
	status: SessionStatus;
	created_at: string;
	mentors?: { id: string; name: string } | null;
	programs?: { id: string; title: string } | null;
	registered_count?: number;
}

export type RegistrationStatus = 'registered' | 'cancelled' | 'attended';

export interface Registration {
	id: string;
	session_id: string;
	user_id: string;
	status: RegistrationStatus;
	created_at: string;
	sessions?: MentoringSession | null;
	profiles?: Pick<Profile, 'id' | 'full_name' | 'school' | 'grade'> | null;
}

export interface Announcement {
	id: string;
	title: string;
	content: string;
	is_published: boolean;
	created_at: string;
}

export interface DocumentationItem {
	id: string;
	title: string;
	description: string | null;
	image_url: string | null;
	session_id: string | null;
	created_at: string;
}
