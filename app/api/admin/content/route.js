
import {NextResponse} from 'next/server';
function retired(){return NextResponse.json({message:'Este editor foi substituído. Use o painel em /admin/paginas do aplicativo miniverso-admin-main.'},{status:410});}
export const GET=retired;
export const POST=retired;
export const PUT=retired;
export const DELETE=retired;
