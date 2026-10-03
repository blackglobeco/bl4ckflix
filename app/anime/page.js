import { redirect } from 'next/navigation';
export default function Anime() {
  redirect('/search?type=anime');
}
