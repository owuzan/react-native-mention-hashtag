import { Fragment } from "react";
import { GestureResponderEvent, Text, TextProps } from "react-native";
import { Provider, useMentionHashtag } from "./Provider";

export interface MentionHashtagTextProps extends TextProps {
  /**
   * Callback when a mention is pressed.
   * @param mention The mention that was pressed.
   * @example
   * ```tsx
   * <MentionHashtagText onMentionPress={(mention) => console.log(mention)}>
   *  Hello @world
   * </MentionHashtagText>
   * ```
   * // Output: world
   */
  onMentionPress?: (mention: string, event: GestureResponderEvent) => void;
  /**
   * Callback when a hashtag is pressed.
   * @param hashtag The hashtag that was pressed.
   * @example
   * ```tsx
   * <MentionHashtagText onHashtagPress={(hashtag) => console.log(hashtag)}>
   * Hello #world
   * </MentionHashtagText>
   * ```
   * // Output: world
   */
  onHashtagPress?: (hashtag: string, event: GestureResponderEvent) => void;
  /**
   * The minimum length of a hashtag to be considered a hashtag.
   * @default 1
   */
  minHashtagLength?: number;
  /**
   * The minimum length of a mention to be considered a mention.
   * @default 5
   */
  minMentionLength?: number;
  /**
   * The style of the mention text.
   * @default {}
   */
  mentionTextStyle?: TextProps["style"];
  /**
   * The style of the hashtag text.
   * @default {}
   */
  hashtagTextStyle?: TextProps["style"];
  /**
   * The text to parse for mentions and hashtags.
   */
  children?: string | null;
}
function MentionHashtagText(props: MentionHashtagTextProps) {
  const context = useMentionHashtag();
  const mergedProps = { ...context, ...props };
  const {
    onMentionPress,
    onHashtagPress,
    minHashtagLength = mergedProps.minHashtagLength &&
    mergedProps.minHashtagLength > 0
      ? mergedProps.minHashtagLength
      : 1,
    minMentionLength = mergedProps.minMentionLength &&
    mergedProps.minMentionLength > 0
      ? mergedProps.minMentionLength
      : 5,
    mentionTextStyle = {},
    hashtagTextStyle = {},
    children,

    ...rest
  } = mergedProps;

  // @ts-ignore
  const withSpace = mergedProps["data-with-space"] !== false;

  if (!children) {
    return null;
  }

  const parts = children.split(/[ \n]/g).map((part, partIndex) => {
    const partKey = `${partIndex}-${part}`;
    const space = withSpace ? " " : "";
    const mentionIndex = part.lastIndexOf("@");
    const hashtagIndex = part.lastIndexOf("#");
    const index = Math.max(mentionIndex, hashtagIndex);
    const type: "normal" | "mention" | "hashtag" =
      index === -1
        ? "normal"
        : mentionIndex > hashtagIndex
        ? "mention"
        : "hashtag";
    if (type === "normal") {
      return [
        part.length ? (
          <Fragment key={partKey}>
            {part}
            {space}
          </Fragment>
        ) : (
          <Fragment key={partKey}>{`\n${space}`}</Fragment>
        ),
      ];
    } else if (type === "mention") {
      return (
        <Fragment key={partKey}>
          {mentionIndex > 0 && (
            <MentionHashtagText {...mergedProps} data-with-space={false}>
              {part.slice(0, mentionIndex)}
            </MentionHashtagText>
          )}
          {part.slice(mentionIndex).length > minMentionLength ? (
            <Text
              key={index}
              onPress={(e) => {
                onMentionPress?.(part.slice(mentionIndex + 1), e);
              }}
              style={mentionTextStyle}
              disabled={rest.disabled}
            >
              {part.slice(mentionIndex)}
            </Text>
          ) : (
            part.slice(mentionIndex)
          )}
          {space}
        </Fragment>
      );
    } else if (type === "hashtag") {
      return (
        <Fragment key={partKey}>
          {hashtagIndex > 0 && (
            <MentionHashtagText {...mergedProps} data-with-space={false}>
              {part.slice(0, hashtagIndex)}
            </MentionHashtagText>
          )}
          {part.slice(hashtagIndex).length > minHashtagLength ? (
            <Text
              key={index}
              onPress={(e) => {
                onMentionPress?.(part.slice(hashtagIndex + 1), e);
              }}
              style={hashtagTextStyle}
              disabled={rest.disabled}
            >
              {part.slice(hashtagIndex)}
            </Text>
          ) : (
            part.slice(hashtagIndex)
          )}
          {space}
        </Fragment>
      );
    }
    return part;
  });

  return <Text {...rest}>{parts}</Text>;
}
MentionHashtagText.displayName = "MentionHashtagText";
MentionHashtagText.Provider = Provider;
