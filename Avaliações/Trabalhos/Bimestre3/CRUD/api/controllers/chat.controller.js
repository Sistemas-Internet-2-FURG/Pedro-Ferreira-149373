import prisma from "../lib/prisma.js";

export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    // Buscar todos os chats do usuário autenticado
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1, // Apenas a última mensagem para exibir um preview
        },
      },
    });

    // Criar um array de IDs de usuários para buscar os detalhes
    const userIds = chats.flatMap(chat => chat.userIDs).filter(id => id !== tokenUserId);
    const uniqueUserIds = [...new Set(userIds)]; // Removendo IDs duplicados

    // Buscar os usuários na base de dados
    const users = await prisma.user.findMany({
      where: {
        id: { in: uniqueUserIds },
      },
      select: {
        id: true,
        username: true,
        avatar: true,
      },
    });

    // Criar um mapa de usuários para facilitar o acesso
    const usersMap = Object.fromEntries(users.map(user => [user.id, user]));

    // Associar o usuário correto (receiver) a cada chat
    const chatsWithReceivers = chats.map(chat => {
      const receiverId = chat.userIDs.find(id => id !== tokenUserId);
      return {
        ...chat,
        receiver: usersMap[receiverId] || null, // Se o usuário não for encontrado, definir como null
      };
    });

    console.log("✅ Chats retornados com receiver:", chatsWithReceivers);

    res.status(200).json(chatsWithReceivers);
  } catch (err) {
    console.error("❌ Erro ao buscar chats:", err);
    res.status(500).json({ message: "Erro ao buscar chats!" });
  }
};



export const getChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    await prisma.chat.update({
      where: {
        id: req.params.id,
      },
      data: {
        seenBy: {
          push: [tokenUserId],
        },
      },
    });
    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};

export const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  const { receiverId } = req.body;

  try {
    // Verifica se já existe um chat entre os usuários
    let chat = await prisma.chat.findFirst({
      where: {
        userIDs: {
          hasEvery: [tokenUserId, receiverId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    if (!chat) {
      // Se não existir, cria um novo chat
      chat = await prisma.chat.create({
        data: {
          userIDs: [tokenUserId, receiverId],
          seenBy: [tokenUserId],
        },
        include: {
          messages: true,
        },
      });
    }

    // Busca os detalhes do destinatário (receiver)
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true, username: true, avatar: true },
    });

    if (!receiver) {
      return res.status(404).json({ message: "Usuário destinatário não encontrado!" });
    }

    // Retorna o chat com os detalhes do destinatário
    res.status(200).json({ ...chat, receiver });

  } catch (err) {
    console.error("❌ Erro ao criar ou buscar chat:", err);
    res.status(500).json({ message: "Erro ao criar ou buscar chat!" });
  }
};



export const readChat = async (req, res) => {
  const tokenUserId = req.userId;

  
  try {
    const chat = await prisma.chat.update({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      data: {
        seenBy: {
          set: [tokenUserId],
        },
      },
    });
    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to read chat!" });
  }
};

export const deleteAllChats = async (req, res) => {
  try {
    // Excluir todas as mensagens primeiro para evitar problemas com relações
    await prisma.message.deleteMany({});

    // Agora, excluir todos os chats
    await prisma.chat.deleteMany({});

    console.log("✅ Todos os chats e mensagens foram excluídos!");
    res.status(200).json({ message: "Todos os chats e mensagens foram excluídos com sucesso!" });
  } catch (err) {
    console.error("❌ Erro ao excluir todos os chats:", err);
    res.status(500).json({ message: "Erro ao excluir todos os chats!" });
  }
};
