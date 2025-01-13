import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react'
import BookCoverSvg from './BookCoverSvg';

type BookCoverVarients = 'extraSmall'|'small' | 'medium' | 'regular' | 'wide';

const varientStyles :Record<BookCoverVarients,string>={
    extraSmall:'book-cover_extra_small',
    small:'book-cover_small',
    medium:'book-cover_medium',
    regular:'book-cover_regular',
    wide:'book-cover_wide',
}

interface props{
    className?:String;
    varient?:BookCoverVarients;
    coverColor:string;
    coverImage:string;
}

function BookCover({className,varient='regular',coverColor='#012B48',coverImage='https://placehold.co/cow.png'}:props) {
  return (
    <div className={cn('relative transition-all duration-300',varientStyles[varient],className)}>
        
        <BookCoverSvg coverColor={coverColor}/>

        <div className='absolute z-10' style={{ left:'12%' , width:'87.5%' , height:'88%'}}>
            <Image src={coverImage} alt='Book cover' fill className='rounded-sm object-fill'/>
        </div>
    </div>
  )
}

export default BookCover