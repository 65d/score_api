// import { NextRequest, NextResponse } from 'next/server'
// import { supabase } from '@/app/lib/supabase'

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     // Get the ID from params - must await in Next.js 15
//     const { id } = await params

//     // First get the current score
//     const { data: currentTeam, error: fetchError } = await supabase
//       .from('teams')
//       .select('score, name, color')
//       .eq('id', id)
//       .single()

//     if (fetchError || !currentTeam) {
//       console.error('Error fetching team:', fetchError)
//       return NextResponse.json(
//         { 
//           success: false, 
//           message: 'Team not found',
//           data: null
//         }, 
//         { status: 404 }
//       )
//     }

//     // Check if the score is already 0
//     if (currentTeam.score === 0) {
//       return NextResponse.json(
//         { success: false, message: 'Score is already 0', data: null },
//         { status: 400 }
//       )
//     }

//     // Decrement the score
//     const { data, error: updateError } = await supabase
//       .from('teams')
//       .update({ score: currentTeam.score - 1 })
//       .eq('id', id)
//       .select()

//     if (updateError) {
//       console.error('Error updating team score:', updateError)
//       return NextResponse.json(
//         { 
//           success: false, 
//           message: 'Failed to update team score',
//           data: null
//         }, 
//         { status: 500 }
//       )
//     }

//     return NextResponse.json({
//       success: true,
//       message: 'Score updated successfully',
//       data: {
//         id: id,
//         name: currentTeam.name,
//         color: currentTeam.color,
//         score: (currentTeam.score - 1)
//       }
//     })
//   } catch (error) {
//     console.error('Error processing request:', error)
//     return NextResponse.json(
//       { 
//         success: false, 
//         message: 'Internal server error',
//         data: null
//       }, 
//       { status: 500 }
//     )
//   }
// }



import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get the ID from params - must await in Next.js 15
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Team ID is required' }, { status: 400 });
    }

    // Fetch the current score
    const { data: currentData, error: fetchError } = await supabase
      .from('teams')
      .select('score')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching team score:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (currentData.score === 0) {
      return NextResponse.json({ error: 'Score is already 0' }, { status: 400 });
    }

    if (!currentData) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Decrement the score
    const newScore = (currentData.score || 0) - 1;

    // Update the score in the database
    const { data: updatedData, error: updateError } = await supabase
      .from('teams')
      .update({ score: newScore })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating team score:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ score: updatedData.score });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

