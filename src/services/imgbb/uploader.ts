import axios from 'axios';
import { IMGBB_API_KEY } from '../../config/env';

const FormData = require('form-data');

const IMGBB_ENDPOINT = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;

type Props = {
  /**
   * The name of the file, this is automatically detected if uploading a file
   * with a POST and multipart / form-data
   */
  name?: string;
  /**
   * A binary file, base64 data, or a URL for an image. (up to 32 MB)
   * Binary file, base64 encoded, image url
   */
  image: string | Buffer;
  /**
   * Enable this if you want to force uploads to be auto deleted after
   * certain time (in seconds 60-15552000)
   */
  expiration?: number;
}

type ResponseType = {
  data: {
      id: string,
      title: string,
      url_viewer: string,
      url: string,
      display_url: string,
      size: number,
      time: string,
      expiration: string,
      is_360: number,
      image: {
          filename: string,
          name: string,
          mime: string,
          extension: string,
          url: string
      },
      thumb: {
          filename:string,
          name: string,
          mime: string,
          extension: string,
          url: string
      },
      delete_url: string
  },
  success: boolean,
  status: number
}

async function uploader(body: Props): Promise<ResponseType> {
  const form = new FormData();

  Object.entries(body).forEach((obj) => {
    const [key, value] = obj;
    form.append(key, value);
  });

  const { data } = await axios.post(IMGBB_ENDPOINT, form, {
    headers: form.getHeaders(),
  });

  return data;
}

export default uploader;
