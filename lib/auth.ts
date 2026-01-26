import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function hashPassword(password: string): Promise<string> {
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(password, salt);
}

export async function verifyPassword(
	password: string,
	hash: string,
): Promise<boolean> {
	return bcrypt.compare(password, hash);
}

export async function signUp(email: string, password: string) {
	try {
		// Create user in Supabase auth
		const { data: authData, error: authError } = await supabase.auth.signUp({
			email,
			password,
		});

		if (authError) {
			return { error: authError.message };
		}

		return { success: true, user: authData.user };
	} catch (error) {
		return { error: 'An unexpected error occurred' };
	}
}

export async function signIn(email: string, password: string) {
	try {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			return { error: error.message };
		}

		return { success: true, user: data.user };
	} catch (error) {
		return { error: 'An unexpected error occurred' };
	}
}

export async function signOut() {
	return supabase.auth.signOut();
}

export async function getCurrentUser() {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	return user;
}
