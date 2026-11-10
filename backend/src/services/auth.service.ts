import prisma from '../config/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';

export const registerUser = async (data: any) => {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) throw new Error('Email already in use');

    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user and return only safe fields (no password)
    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
        },
        select: { id: true, name: true, email: true, createdAt: true }
    });

    return user;
};

export const loginUser = async (email: string, pass: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Email not match');

    const isValid = await bcrypt.compare(pass, user.password);
    if (!isValid) throw new Error('Incorrect password');

    // Generate Tokens
    const accessToken = jwt.sign({ id: user.id }, ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: '7d' });

    return {
        user: { id: user.id, name: user.name, email: user.email },
        accessToken,
        refreshToken
    };
};

export const refreshAccessToken = async (token: string) => {
    try {
        const decoded = jwt.verify(token, REFRESH_SECRET) as { id: string };

        const accessToken = jwt.sign({ id: decoded.id }, ACCESS_SECRET, { expiresIn: '15m' });
        const newRefreshToken = jwt.sign({ id: decoded.id }, REFRESH_SECRET, { expiresIn: '7d' });

        return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
        throw new Error('Invalid refresh token');
    }
};