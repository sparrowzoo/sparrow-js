"use client";
import * as React from "react";
import SZGlobalStyles from "@/app/lesson/mui-customization/good-practice/OverrideGlobalStyles";
import { OutlinedInput, TextField } from "@mui/material";

export default function page(props: any) {
  return (
    <React.Fragment>
      <OutlinedInput />
      <TextField
        helperText={"email"}
        id="email"
        type="email"
        name="email"
        placeholder="your@email.com"
        autoComplete="email"
        autoFocus
        required
        fullWidth
        variant="outlined"
        color={"primary"}
        sx={{ ariaLabel: "email" }}
      />
      <div>
        {SZGlobalStyles}
        <h1>Grey h1 element</h1>
        <TextField
          helperText={"email"}
          id="email"
          type="email"
          name="email"
          placeholder="your@email.com"
          autoComplete="email"
          autoFocus
          required
          fullWidth
          variant="outlined"
          color={"primary"}
          sx={{ ariaLabel: "email" }}
        />
      </div>
    </React.Fragment>
  );
}
