import axios from "axios";

const KEY = "38888866-b532d9b8e62cbcdf24e4130f8";
axios.defaults.baseURL = "https://pixabay.com/api/"
export async function fetchPhoto(q, page, perPage){
    // const url = `${BASE_URL}?key=${KEY}&q=${q}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horisontal&safesearch=true`;
    const params = new URLSearchParams(
        {
            key: KEY,
            q,
            page,
            per_page: perPage,
            image_type: "photo",
            orientation: "horizontal",
            safe_search: true           
        }
    )
    const resp = await axios.get(`?${params}`);
    return resp.data;
     
}

