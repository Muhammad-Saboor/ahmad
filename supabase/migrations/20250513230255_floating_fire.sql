/*
  # Add INSERT policy for profiles table
  
  1. Changes
    - Add INSERT policy to allow authenticated users to create their own profile
    
  2. Security
    - Policy ensures users can only create a profile with their own auth.uid()
    - Maintains existing RLS policies for SELECT and UPDATE
*/

CREATE POLICY "Users can create own profile" 
ON profiles 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);