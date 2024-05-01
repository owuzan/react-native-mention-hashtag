import { MentionHashtagTextProps } from "./MentionHashtagText";
import React, { createContext, useContext } from "react";

export const MentionHashtagContext = createContext<MentionHashtagTextProps>({});
export function useMentionHashtag() {
  const context = useContext(MentionHashtagContext);
  return context;
}

type MentionHashtagProviderProps = MentionHashtagTextProps & {
  children?: React.ReactNode;
};
export function MentionHashtagProvider(props: MentionHashtagProviderProps) {
  const { children, ...rest } = props;
  return (
    <MentionHashtagContext.Provider value={rest}>
      {children}
    </MentionHashtagContext.Provider>
  );
}
MentionHashtagProvider.displayName = "MentionHashtagProvider";
