import React, { Fragment } from "react";
import {
  GestureResponderEvent,
  StyleProp,
  Text,
  TextProps,
  TextStyle,
} from "react-native";
import { useMentionHashtag } from "./Provider";
import { merge } from "lodash";
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
  mentionTextStyle?: StyleProp<TextStyle>;
  /**
   * The style of the hashtag text.
   * @default {}
   */
  hashtagTextStyle?: StyleProp<TextStyle>;
  /**
   * The text to parse for mentions and hashtags.
   */
  children?: string | null;
  /**
   * For internal use only. (data-with-space)
   */
  [key: `data-${string}`]: any;
}
export const MentionHashtagText = (props: MentionHashtagTextProps) => {
  const context = useMentionHashtag();
  const mergedProps = merge({}, context, props);
  const {
    onMentionPress,
    onHashtagPress,
    minHashtagLength = 1,
    minMentionLength = 1,
    mentionTextStyle = {},
    hashtagTextStyle = {},
    children,
    ...rest
  } = mergedProps;

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
};

MentionHashtagText.displayName = "MentionHashtagText";
