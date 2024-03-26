import {AddReport} from '@/app/components/Report/AddReport';
import { getServerFetch } from '@/lib/serverFetching';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Add Report",
  };
  
export default async function Page() {
    const {data: restaurants} = await getServerFetch('/api/all-restaurants')

    return <AddReport restaurants={restaurants}/>
}