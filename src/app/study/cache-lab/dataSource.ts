type CacheLabPayload = {
  label: string;
  version: number;
  updatedAt: string;
};

const formatDateTime = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

let version = 1;
let updatedAt = formatDateTime(new Date());

export const readCacheLabData = (label: string): CacheLabPayload => {
  return {
    label,
    version,
    updatedAt,
  };
};

export const mutateCacheLabData = () => {
  version += 1;
  updatedAt = formatDateTime(new Date());
  return {
    version,
    updatedAt,
  };
};
