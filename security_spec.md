# Security Specification for BroBread POS

## 1. Data Invariants
- A transaction must have at least one item.
- A transaction total must match the sum of its items' (price * quantity). (Wait, rules can't iterate, so we strictly check types).
- A product price must be non-negative.
- Only admins can modify the product catalog or system configuration.
- Users can only modify their own profiles (non-role fields).
- Transactions are immutable for 'kasir' users once created.

## 2. The Dirty Dozen Payloads (Rejection Targets)
1. **Identity Spoofing**: Create a user document with someone else's UID.
2. **Privilege Escalation**: Update own role from 'kasir' to 'admin'.
3. **Negative Pricing**: Create a product with `price: -100`.
4. **Massive Payload**: Send a transaction with 10,000 items (DosW).
5. **Junk ID**: Create a product with a 2KB long string as ID.
6. **Orphaned Transaction**: Create a transaction referencing a non-existent product ID (exists() check).
7. **Backdated Sale**: Create a transaction with a `timestamp` from 2020.
8. **Shadow Update**: Add an `isVerified: true` field to a product.
9. **Role Bypass**: Delete a transaction as a 'kasir'.
10. **Config Tampering**: Update bakery name as a 'kasir'.
11. **Price Manipulation**: Create a transaction where the item price is different from the catalog price (requires get() check).
12. **Insecure List**: Attempt to list all transactions across all users if a rule was loose (our rules check `isSignedIn()`).

## 3. Test Runner Plan
I will use `firestore.rules.test.ts` with the Firebase Rules Emulator (if available) or at least define the logic here for validation.
Since I cannot run a full emulator suite here easily, I will manually inspect the rules against these payloads.
