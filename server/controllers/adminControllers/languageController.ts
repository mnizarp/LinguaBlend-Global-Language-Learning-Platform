import { Request, Response } from "express";
import { Language } from "../../models/languageModel";
import cloudinary from "../../utils/cloudinary";



export const addNewLanguage = async (req: Request, res: Response) => {
  try {
    const { language,flag } = req.body;
    const languageInCapital = language.toUpperCase();
    const isExists = await Language.findOne({ language: languageInCapital });
    if (!isExists) {
      const uploadResponse = await cloudinary.uploader.upload(flag, {
        upload_preset: "linguaBlend",
      });
      const newlanguage = new Language({
        language: languageInCapital,
        flag: uploadResponse.url,
        list: true,
      });
      await newlanguage.save();
      res.status(200).json({ message: "language added successfully" });
    } else {
      res.status(401).json({ message: "language already exists" });
    }
  } catch (error) {
    res.status(400).json({ message: "language adding failed" });
  }
};

export const getLanguages = async (req: Request, res: Response) => {
  try {
    const languages = await Language.find({});
    if (languages.length > 0) {
      res.status(200).json({ languages });
    } else {
      res.status(401).json({ message: "language empty" });
    }
  } catch (error) {
    res.status(400);
    console.log(error);
  }
};

export const language_list_unlist = async (req: Request, res: Response) => {
  try {
    const { languageId } = req.body;
    await Language.findByIdAndUpdate({ _id: languageId }, [
      {
        $set: {
          list: {
            $cond: {
              if: { $eq: ["$list", true] },
              then: false,
              else: true,
            },
          },
        },
      },
    ]);
    res.status(200).json({ message: "list update done" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "list update failed" });
  }
};
