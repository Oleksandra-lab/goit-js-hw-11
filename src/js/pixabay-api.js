import axios from "axios";

const BASE_URL = "https://pixabay.com/api/";
const KEY = "38888866-b532d9b8e62cbcdf24e4130f8";

export async function fetchPhoto(q, page, perPage){
    const url = `${BASE_URL}?key=${KEY}&q=${q}&page=${page}&per_page=${perPage}&image_tpe=photo&orientation=horisontal&safesearch=true`;
    const resp = await axios.get(url);
    return resp.data;    
}
