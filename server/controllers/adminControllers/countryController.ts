import { Request, Response } from "express";
import { Country } from "../../models/countryModel";
import cloudinary from "../../utils/cloudinary";



export const addNewCountry = async (req: Request, res: Response) => {
  try {
    const { country,flag } = req.body;
    const countryInCapital = country.toUpperCase();
    const isExists = await Country.findOne({ country: countryInCapital });
    if (!isExists) {
      
      const uploadResponse = await cloudinary.uploader.upload(flag, {
        upload_preset: "linguaBlend",
      });
      const newcountry = new Country({
        country: countryInCapital,
        flag:uploadResponse.url,
        list: true,
      });
      await newcountry.save();
      res.status(200).json({ message: "country added successfully" });
    } else {
      res.status(401).json({ message: "country already exists" });
    }
  } catch (error) {
    res.status(400).json({ message: "country adding failed" });
  }
};

export const getCountries = async (req: Request, res: Response) => {
  try {
    const countries = await Country.find({});
    if (countries.length > 0) {
      res.status(200).json({ countries });
    } else {
      res.status(401).json({ message: "countries empty" });
    }
  } catch (error) {
    res.status(400);
    console.log(error);
  }
};

export const country_list_unlist = async (req: Request, res: Response) => {
  try {
    const { countryId } = req.body;
    await Country.findByIdAndUpdate({ _id: countryId }, [
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
