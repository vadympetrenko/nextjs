import { cookies } from "next/headers";

type getServerFetchType<T> = (url: string, caches?:{ cache?: RequestCache, next?: {revalidate? : number,  tags?: string[]}}) => Promise<T>;

export type Status = 'warning' | 'success' | 'error' | 'info' | 'default'

type Response = {
  status: Status
  data: any
  message?: string
}

const getCoockie = async () => {
  const cookieStore = cookies();
  return cookieStore
  .getAll()
  .map((cookie) => `${cookie.name}=${cookie.value}`)
  .join("; ");
}

export const getServerFetch:getServerFetchType<Response> = async (url, caches) => {
  const res = caches ? await fetch(`${process.env.NEXTAUTH_URL}${url}`, {
    headers: {
      Cookie: await getCoockie()
    },
    ...caches
  }) : await fetch(`${process.env.NEXTAUTH_URL}${url}`, {
    headers: {
      Cookie: await getCoockie()
    },
  });

  return res.json();
};
