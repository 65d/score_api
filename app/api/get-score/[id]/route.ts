// import { NextRequest, NextResponse } from 'next/server'
// import { supabase } from '@/app/lib/supabase'

// export async function GET(request: NextRequest, { params }: { params: { t1: string } }) {
//   const { t1 } = params
//   const { data, error } = await supabase.from('teams').select('score').eq('id', t1).single(); // Ensure a single result

//   if (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }

//   if (!data) {
//     return NextResponse.json({ error: 'Team not found' }, { status: 404 }); // Handle cases where no team is found
//   }

//   return NextResponse.json({ score: data.score }); // Return only the score for simplicity
// }
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Team ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('teams')
      .select('score')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching team score:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    return NextResponse.json({ score: data.score });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

