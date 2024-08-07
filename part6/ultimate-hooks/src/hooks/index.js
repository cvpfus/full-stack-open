import { useEffect, useState } from "react";
import axios from "axios";

export const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

export const useResource = (baseUrl) => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const data = await getAll();
        if (!ignore) setResources(data);
      } catch (error) {
        console.log("error:", error.message);
      }
    }

    fetchData();

    return () => {
      ignore = true;
    }
  }, [])

  const getAll = async () => {
    const response = await axios.get(baseUrl);
    setResources(response.data);
    return response.data;
  };

  const create = async (resource) => {
    const response = await axios.post(baseUrl, resource);
    setResources(resources.concat(response.data));
    return response.data;
  };

  const service = {
    getAll,
    create,
  };

  return [resources, service];
};
