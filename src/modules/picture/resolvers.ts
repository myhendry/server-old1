import { ResolverMap } from "../../types/ResolverType";
import { Picture } from "../../entity/Picture";
import { processUpload } from "../../utils/uploadImageGql";
import { pubsub } from "../../utils/pubsub";
import { requireAuth } from "../../utils/manageAuth";
import { getConnection } from "typeorm";
import { processCloudinaryUpload } from "../../utils/uploadCloudinary";

const NEW_PICTURE = "NEW_PICTURE";

export const resolvers: ResolverMap = {
  Picture: {
    user: ({ userId }, _, { userLoader }) => {
      return userLoader.load(userId);
    }
  },
  Query: {
    pictures: async (_, { offset, limit }) => {
      console.log(offset, limit);
      let picturesDB = getConnection()
        .getRepository(Picture)
        .createQueryBuilder("p");
      return picturesDB
        .take(limit)
        .skip(offset)
        .getMany();

      /* #region WITHOUT PAGINATION */
      // const pictures = await Picture.find({});
      // return pictures;
      /* #endRegion */
    }
  },
  Mutation: {
    uploadPicture: async (_, { file }) => {
      console.log("upload file ", file);
      // console.log("await stream ", stream);

      try {
        //TODO upload to cloudinary
        /* #region UPLOAD TO CLOUDINARY */
        await processCloudinaryUpload(file);

        /* #endRegion */

        /* #region UPLOAD TO LOCAL SERVER*/
        //!upload to server
        // let pictureUrl;
        // if (file) {
        //   // If got picture
        //   pictureUrl = await processUpload(file);
        //   console.log("pictureUrl ", pictureUrl);
        // }
        /* #endregion */
      } catch (error) {
        throw error;
      }
      return true;
    },
    deletePicture: async (_, { pictureId }, { req }) => {
      try {
        const picture = await Picture.findOne({ where: { id: pictureId } });

        if (!picture) {
          throw new Error("Picture does not exist");
        }

        if (picture && req.user.id !== picture.userId) {
          throw new Error("Not authorized");
        }

        await Picture.remove(picture);
        return true;
      } catch (error) {
        throw error;
      }
    },
    createPicture: async (_, { input, picture }, { req }) => {
      try {
        await requireAuth(req.user);
        // console.log("resolver picture ", picture);
        let pictureUrl = "www.google.com";

        if (picture) {
          // If got picture
          pictureUrl = await processUpload(picture);
          // console.log("pictureUrl ", pictureUrl);
        }

        const pic = await Picture.create({
          ...input,
          pictureUrl,
          user: req.user
        }).save();
        // console.log(pic);

        pubsub.publish(NEW_PICTURE, {
          newPicture: pic
        });

        return pic;
      } catch (error) {
        throw error;
      }
    }
  },
  Subscription: {
    newPicture: {
      subscribe: (_, __, { pubsub }) => {
        return pubsub.asyncIterator(NEW_PICTURE);
      }
    }
  }
};
