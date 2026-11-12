import prisma from '../config/database';

export interface AccountSettingsInput {
  name?: string;
  emailTaskDue?: boolean;
  weeklyReport?: boolean;
  theme?: 'system' | 'light' | 'dark';
}

const profileSelect = { id: true, name: true, email: true } as const;

export const getAccountSettings = async (userId: string) => {
  const [user, settings] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: profileSelect }),
    prisma.userSettings.upsert({ where: { userId }, create: { userId }, update: {} }),
  ]);
  return { ...user, settings };
};

export const updateAccountSettings = async (userId: string, input: AccountSettingsInput) => {
  const { name, emailTaskDue, weeklyReport, theme } = input;
  return prisma.$transaction(async (transaction) => {
    const profile = name === undefined
      ? await transaction.user.findUnique({ where: { id: userId }, select: profileSelect })
      : await transaction.user.update({ where: { id: userId }, data: { name }, select: profileSelect });
    const preferences = {
      ...(emailTaskDue === undefined ? {} : { emailTaskDue }),
      ...(weeklyReport === undefined ? {} : { weeklyReport }),
      ...(theme === undefined ? {} : { theme }),
    };
    const settings = await transaction.userSettings.upsert({
      where: { userId },
      create: { userId, ...preferences },
      update: preferences,
    });
    return { ...profile, settings };
  });
};

export const getSupportTickets = (userId: string) => prisma.supportTicket.findMany({
  where: { userId },
  orderBy: { createdAt: 'desc' },
});

export const createSupportTicket = (userId: string, subject: string, message: string) => prisma.supportTicket.create({
  data: { userId, subject, message },
});
