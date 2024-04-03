import { supabase } from '../../lib/supabase'

export async function transferFunds(senderAccountId: string, receiverAccountId: string, amount: number) {
  try {
    // Deduct amount from sender's account
    await supabase
      .from('accounts')
      .update({ balance: `balance - ${amount}` })
      .eq('id', senderAccountId)

    // Add amount to receiver's account
    await supabase
      .from('accounts')
      .update({ balance: `balance + ${amount}` })
      .eq('id', receiverAccountId)

    // Record transaction
    await supabase
      .from('transactions')
      .insert({ sender_account_id: senderAccountId, receiver_account_id: receiverAccountId, amount: amount })

    // Send notifications to sender and receiver
    // Implement notification logic here
  } catch (error) {
    console.error('Error transferring funds:', error)
    throw new Error('Failed to transfer funds')
  }
}
