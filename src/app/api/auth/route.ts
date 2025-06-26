import { NextRequest, NextResponse } from 'next/server'
import { ethers } from 'ethers'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { address, signature, message, nonce } = await request.json()

    if (!address || !signature || !message || !nonce) {
      return NextResponse.json(
        { error: 'Missing required fields: address, signature, message, nonce' },
        { status: 400 }
      )
    }

    // Verify the signature
    try {
      const recoveredAddress = ethers.utils.verifyMessage(message, signature)
      
      if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        )
      }
    } catch (error) {
      console.error('Signature verification error:', error)
      return NextResponse.json(
        { error: 'Signature verification failed' },
        { status: 401 }
      )
    }

    // Check if user exists, create if not
    let { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', address.toLowerCase())
      .single()

    if (userError && userError.code !== 'PGRST116') {
      console.error('Database error:', userError)
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      )
    }

    if (!user) {
      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([
          {
            wallet_address: address.toLowerCase(),
            display_name: `User ${address.slice(0, 6)}...${address.slice(-4)}`,
            reputation_score: 0,
            is_verified: false,
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString()
          }
        ])
        .select()
        .single()

      if (createError) {
        console.error('User creation error:', createError)
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        )
      }

      user = newUser
    } else {
      // Update last login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('wallet_address', address.toLowerCase())
    }

    // Generate a simple session token (in production, use JWT or more secure method)
    const sessionToken = Buffer.from(
      JSON.stringify({
        address: address.toLowerCase(),
        timestamp: Date.now(),
        nonce
      })
    ).toString('base64')

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        wallet_address: user.wallet_address,
        display_name: user.display_name,
        reputation_score: user.reputation_score,
        is_verified: user.is_verified,
        ens_name: user.ens_name
      },
      session_token: sessionToken
    })

  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    
    try {
      const sessionData = JSON.parse(Buffer.from(token, 'base64').toString())
      const { address, timestamp } = sessionData

      // Check if token is not too old (24 hours)
      const tokenAge = Date.now() - timestamp
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

      if (tokenAge > maxAge) {
        return NextResponse.json(
          { error: 'Session expired' },
          { status: 401 }
        )
      }

      // Get user data
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', address.toLowerCase())
        .single()

      if (userError || !user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          wallet_address: user.wallet_address,
          display_name: user.display_name,
          reputation_score: user.reputation_score,
          is_verified: user.is_verified,
          ens_name: user.ens_name
        }
      })

    } catch (error) {
      console.error('Token parsing error:', error)
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('Auth verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // For logout, we just need to invalidate the token on client side
    // Since we're using stateless tokens, there's no server-side session to destroy
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
