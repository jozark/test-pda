import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { Game } from "../target/types/game";
import { expect } from "chai";

describe("game", async () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Game as Program<Game>;

  it("Sets and changes name!", async () => {
    const [userStatsPDA, _] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("user-stats"),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    );

    console.log(userStatsPDA, "userStatsPDA");

    await program.methods
      .createUserStats("jozark")
      .accounts({
        user: provider.wallet.publicKey,
        userStats: userStatsPDA,
      })
      .rpc();

    expect((await program.account.userStats.fetch(userStatsPDA)).name).to.equal(
      "jozark"
    );

    await program.methods
      .changeUserName("jo_zark")
      .accounts({
        user: provider.wallet.publicKey,
        userStats: userStatsPDA,
      })
      .rpc();

    expect((await program.account.userStats.fetch(userStatsPDA)).name).to.equal(
      "jo_zark"
    );
  });
});
