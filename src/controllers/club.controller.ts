import { Request, Response } from "express";
import { prisma } from "../db";
import { uploadImageToSupabase } from "../lib/supabase";
import { v4 as uuidv4 } from 'uuid';

/**
 * Crear un nuevo club (solo ADMIN)
 */
export const createClub = async (req: Request, res: Response) => {
  try {
    const { name, description, address, city, zone, lat, lng, ownerId } = req.body;

    if (!name || !ownerId) {
      return res.status(400).json({ error: "El nombre y el ownerId son obligatorios" });
    }

    const ownerExists = await prisma.user.findUnique({ where: { id: ownerId } });
    if (!ownerExists) {
      return res.status(404).json({ error: "Propietario no encontrado" });
    }

    const club = await prisma.club.create({
      data: {
        name,
        description,
        address,
        city,
        zone,
        lat,
        lng,
        ownerId,
      },
    });

    res.status(201).json({ message: "Club creado correctamente", club });
  } catch (error) {
    console.error("Error en createClub:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

/**
 * Crear un nuevo club para usuario CLUB (auto-asignado)
 */
export const createMyClub = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { name, description, address, city, zone, lat, lng } = req.body;

    if (!name) {
      return res.status(400).json({ error: "El nombre del club es obligatorio" });
    }

    // Verificar que el usuario no tenga ya un club
    const existingClub = await prisma.club.findFirst({
      where: { 
        ownerId: userId,
        isActive: true 
      }
    });

    if (existingClub) {
      return res.status(400).json({ error: "Ya tienes un club registrado" });
    }

    const club = await prisma.club.create({
      data: {
        name,
        description,
        address,
        city,
        zone,
        lat,
        lng,
        ownerId: userId,
      },
      include: {
        courts: true
      }
    });

    res.status(201).json(club);
  } catch (error) {
    console.error("Error en createMyClub:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

/**
 * Obtener todos los clubes (visible para ADMIN)
 */
/**
 * Obtener todos los clubes (visible para cualquier usuario autenticado)
 * Muestra también sus canchas activas
 */
export const getAllClubs = async (_req: Request, res: Response) => {
  try {
    const clubs = await prisma.club.findMany({
      where: { isActive: true }, // Solo clubes activos
      include: {
        owner: {
          select: { id: true, email: true, name: true },
        },
        courts: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            surface: true,
            basePrice: true,
            isActive: true,
          },
        },
        images: {
          orderBy: { orderIndex: 'asc' }
        },
      },
      orderBy: { name: "asc" },
    });

    res.json(clubs);
  } catch (error) {
    console.error("Error en getAllClubs:", error);
    res.status(500).json({ error: "Error al obtener los clubes" });
  }
};

/**
 * Obtener un club por ID (ADMIN o CLUB propietario)
 */
export const getClubById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    const club = await prisma.club.findUnique({
      where: { id },
      include: { 
        owner: true,
        courts: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            surface: true,
            basePrice: true,
            isActive: true,
            currency: true,
            indoor: true,
          },
        },
        images: {
          orderBy: { orderIndex: 'asc' }
        },
      },
    });

    if (!club) return res.status(404).json({ error: "Club no encontrado" });

    res.json(club);
  } catch (error) {
    console.error("Error en getClubById:", error);
    res.status(500).json({ error: "Error al obtener el club" });
  }
};

/**
 * Actualizar un club (solo ADMIN o el propietario)
 */
export const updateClub = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;
    const role = (req as any).role;

    const club = await prisma.club.findUnique({ where: { id } });
    if (!club) return res.status(404).json({ error: "Club no encontrado" });

    if (club.ownerId !== userId && role !== "ADMIN") {
      return res.status(403).json({ error: "No tienes permiso para editar este club" });
    }

    const updated = await prisma.club.update({
      where: { id },
      data: req.body,
    });

    res.json({ message: "Club actualizado", club: updated });
  } catch (error) {
    console.error("Error en updateClub:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

/**
 * Obtener el club del usuario actual (solo CLUB)
 */
export const getMyClub = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const club = await prisma.club.findFirst({
      where: { 
        ownerId: userId,
        isActive: true 
      },
      include: {
        courts: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            surface: true,
            basePrice: true,
            isActive: true,
            currency: true,
            indoor: true,
          },
        },
        images: {
          orderBy: { orderIndex: 'asc' }
        },
      },
    });

    if (!club) {
      return res.status(404).json({ error: "No tienes un club registrado" });
    }

    res.json(club);
  } catch (error) {
    console.error("Error en getMyClub:", error);
    res.status(500).json({ error: "Error al obtener el club" });
  }
};

/**
 * Desactivar (soft delete) un club (solo ADMIN)
 */
export const deactivateClub = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const club = await prisma.club.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({ message: "Club desactivado", club });
  } catch (error) {
    console.error("Error en deactivateClub:", error);
    res.status(500).json({ error: "Error al desactivar el club" });
  }
};

/**
 * Obtener estadísticas de ingresos del club
 */
export const getClubEarnings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { startDate, endDate } = req.query;

    // Obtener el club del usuario
    const club = await prisma.club.findFirst({
      where: { ownerId: userId },
    });

    if (!club) {
      return res.status(404).json({ error: "Club no encontrado para este usuario." });
    }

    const whereClause: any = {
      clubId: club.id,
      status: 'PAID',
    };

    if (startDate && endDate) {
      whereClause.createdAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    const stats = await prisma.reservation.aggregate({
      where: whereClause,
      _sum: {
        totalCents: true,
        platformFeeCents: true,
        clubFeeCents: true,
      },
      _count: {
        id: true,
      },
    });

    const totalRevenue = stats._sum.totalCents || 0;
    const platformRevenue = stats._sum.platformFeeCents || 0;
    const clubRevenue = stats._sum.clubFeeCents || 0;
    const totalReservations = stats._count.id || 0;

    res.json({
      club: {
        id: club.id,
        name: club.name,
        city: club.city,
        zone: club.zone,
      },
      totalRevenue,
      platformRevenue,
      clubRevenue,
      totalReservations,
      averageReservationValue: totalReservations > 0 ? Math.round(totalRevenue / totalReservations) : 0,
      platformPercentage: totalRevenue > 0 ? Math.round((platformRevenue / totalRevenue) * 100) : 0,
    });
  } catch (error) {
    console.error("Error obteniendo estadísticas del club:", error);
    res.status(500).json({ error: "Error obteniendo estadísticas del club" });
  }
};

/**
 * Subir imágenes del club
 */
export const uploadClubImages = async (req: Request, res: Response) => {
  try {
    const { clubId } = req.params;
    const userId = (req as any).userId;
    const role = (req as any).role;

    // Verificar que el usuario tenga acceso al club
    const club = await prisma.club.findUnique({
      where: { id: clubId },
    });

    if (!club) {
      return res.status(404).json({ error: "Club no encontrado" });
    }

    if (role !== "ADMIN" && club.ownerId !== userId) {
      return res.status(403).json({ error: "No tienes permiso para subir imágenes a este club" });
    }

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No se han proporcionado archivos de imagen" });
    }

    const uploadedImages = [];

    for (const file of files) {
      try {
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${uuidv4()}.${fileExtension}`;
        const filePath = `club_images/${clubId}/${fileName}`;

        // Subir imagen a Supabase Storage
        console.log("Subiendo imagen a Supabase:", {
          bucket: 'padel-images',
          filePath,
          mimetype: file.mimetype,
          size: file.buffer.length
        });
        
        const publicUrl = await uploadImageToSupabase(
          'padel-images', // Nombre del bucket
          filePath,
          file.buffer,
          file.mimetype
        );
        
        console.log("Imagen subida exitosamente:", publicUrl);

        // Guardar en la base de datos
        const newClubImage = await prisma.clubImage.create({
          data: {
            url: publicUrl,
            alt: `Imagen de ${club.name}`,
            clubId: club.id,
          },
        });

        uploadedImages.push(newClubImage);
      } catch (uploadError) {
        console.error("Error subiendo imagen:", uploadError);
        return res.status(500).json({ 
          error: "Error al subir una de las imágenes", 
          details: uploadError instanceof Error ? uploadError.message : "Error desconocido"
        });
      }
    }

    res.status(201).json({ 
      message: "Imágenes subidas exitosamente", 
      images: uploadedImages 
    });
  } catch (error) {
    console.error("Error en uploadClubImages:", error);
    if (error instanceof Error) {
      res.status(500).json({ 
        error: "Error interno del servidor al subir imágenes", 
        details: error.message 
      });
    } else {
      res.status(500).json({ 
        error: "Error interno del servidor al subir imágenes", 
        details: "Error desconocido" 
      });
    }
  }
};
