import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'

const fetcher = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
  // return { data: data?.user || null };
};

export function useUser({ redirectTo, redirectIfFound } = {}) {
  const router = useRouter();

  const { data, error, isLoading } = useSWR('/api/user', fetcher)
  const user = data?.user || null;
  const finished = Boolean(data)
  const hasUser = Boolean(user)

  useEffect(() => {
    if (!redirectTo || !finished) return
    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !hasUser) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && hasUser)
    ) {
      router.push(redirectTo)
    }
  }, [redirectTo, redirectIfFound, finished, hasUser])

  return error ? { user: null } : { user, isLoading }
}