import { log } from 'console';
import { FastifyReply } from 'fastify';
import * as mongoose from 'mongoose';

import { JWTCredential } from '../middlewares/auth.middleware';
import Document, { DocumentInterface } from '../models/Document';

export const getAllDocument = async (request: any, reply: FastifyReply) => {
  try {
    const { id } = request.user as JWTCredential;

    const document = await Document.find({ userId: id })
      .select('-content')
      .sort({ createdAt: -1 });

    return reply.send(document);
  } catch (err: any) {
    return reply.send({
      statusCode: 500,
      message: err.message,
    });
  }
};

export const getDocument = async (request: any, reply: FastifyReply) => {
  try {
    const { id: userId } = request.user as JWTCredential;
    const { id } = request.params;

    const document = await Document.findById<DocumentInterface>(id);

    if (!document) {
      return reply.code(404).send({
        statusCode: 404,
        message: "Document doesn't exist",
      });
    }

    if (userId !== document.userId.toString()) {
      return reply.code(401).send({
        statusCode: 401,
        message: 'Unauthorized',
      });
    }

    return reply.send(document);
  } catch (err: any) {
    return reply.send({
      statusCode: 500,
      message: err.message,
    });
  }
};

export const getPublicDocument = async (request: any, reply: FastifyReply) => {
  try {
    const { id } = request.params;

    const document = await Document.findOne<DocumentInterface>({
      _id: id,
      userId: null,
    });

    if (!document) {
      return reply.code(404).send({
        statusCode: 404,
        message: 'Document is not found',
      });
    }

    return reply.send(document);
  } catch (err: any) {
    return reply.send({
      statusCode: 500,
      message: err.message,
    });
  }
};

export const postDocument = async (request: any, reply: FastifyReply) => {
  try {
    const { id: userId = null } = request.user as JWTCredential;
    const { title, content } = request.body;

    const document = new Document({
      userId,
      title,
      content,
    });

    await document.save();

    return reply.code(201).send(document);
  } catch (err: any) {
    return reply.send({
      statusCode: 500,
      message: err.message,
    });
  }
};

export const postPublicDocument = async (request: any, reply: FastifyReply) => {
  try {
    const { title, content } = request.body;

    const document = new Document({
      userId: null,
      title,
      content,
    });

    await document.save();

    return reply.code(201).send(document);
  } catch (err: any) {
    return reply.send({
      statusCode: 500,
      message: err.message,
    });
  }
};

export const putDocument = async (request: any, reply: FastifyReply) => {
  const { id: userId } = request.user as JWTCredential;
  const { id: documentId } = request.params;
  const { content, title } = request.body;

  try {
    const document = await Document.findById<DocumentInterface>(documentId);

    if (!document) {
      return reply.code(404).send({
        statusCode: 404,
        message: 'Document not found',
      });
    }

    if (userId !== document.userId.toString()) {
      return reply.code(401).send({
        statusCode: 401,
        message: 'Unauthorized',
      });
    }

    document.title = title;
    document.content = content;
    await document.save();

    return reply.send(document);
  } catch (err: any) {
    return reply.send({
      statusCode: 500,
      message: err.message,
    });
  }
};

export const putPublicDocument = async (request: any, reply: FastifyReply) => {
  const { id: documentId } = request.params;
  const { content, title } = request.body;

  try {
    const document = await Document.findById<DocumentInterface>(documentId);

    if (!document) {
      return reply.code(404).send({
        statusCode: 404,
        message: 'Document not found',
      });
    }

    document.title = title;
    document.content = content;
    await document.save();

    return reply.send(document);
  } catch (err: any) {
    return reply.send({
      statusCode: 500,
      message: err.message,
    });
  }
};

export const deleteDocument = async (request: any, reply: FastifyReply) => {
  const { id: documentId } = request.params;
  const { id: userId } = request.user as JWTCredential;

  if (!mongoose.Types.ObjectId.isValid(documentId)) {
    return reply.code(400).send({
      statusCode: 400,
      message: 'Invalid document id',
    });
  }

  try {
    const document = await Document.findById<DocumentInterface>(documentId);

    if (!document) {
      return reply.code(404).send({
        statusCode: 404,
        message: 'Document not found',
      });
    }

    if (userId !== document.userId.toString()) {
      return reply.code(401).send({
        statusCode: 401,
        message: 'Unauthorized',
      });
    }

    await document.remove();

    return reply.send({
      statusCode: 200,
      message: 'Document deleted',
    });
  } catch (err: any) {
    return reply.send({
      statusCode: 500,
      message: err.message,
    });
  }
};
