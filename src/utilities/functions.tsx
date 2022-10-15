// @ts-nocheck
import tw from "tailwind-styled-components/dist/tailwind";
import Link from "next/link";
import { setChannel, useServersState } from "../features/servers";
import { useAppDispatch } from "../redux/hooks";

export function parseURLs(message: string) {
  if (
    !message ||
    (!message.includes("https://") && !message.includes("http://"))
  )
    return message;

  const messageArray = message.split(/(https?:\/\/\w[^ ]+)/);

  const fixedArray = addSlash(messageArray);

  return (
    <>
      {fixedArray.map((message, index) => {
        return index % 2 === 0 ? (
          <span key={index}>{message}</span>
        ) : (
          <Link href={message} passHref key={index}>
            <LinkText rel="noreferrer noopener" target="_blank">
              {message}
            </LinkText>
          </Link>
        );
      })}
    </>
  );
}

function addSlash(messageArray: string[]) {
  return messageArray.map((message, index) => {
    return index % 2 === 0
      ? message
      : message.includes("/", 8)
      ? message
      : message.concat("/");
  });
}

export function useParseLinks(message: string) {
  const { channels } = useServersState();
  const dispatch = useAppDispatch();

  if (!message || !message.includes("#")) return parseURLs(message);

  const messageArray = message.split(/(#\w[^ ]+)/);

  return (
    <>
      {messageArray.map((message, index) => {
        const match = channels.find(
          (channel) => message.substring(1) === channel.name
        );

        return match ? (
          <Link href={match.path} passHref key={index}>
            <ChannelLinkText onClick={() => dispatch(setChannel(match))}>
              {parseURLs(message)}
            </ChannelLinkText>
          </Link>
        ) : (
          <span key={index}>{parseURLs(message)}</span>
        );
      })}
    </>
  );
}

const LinkText = tw.a`
  text-url-link
  hover:underline
`;

const ChannelLinkText = tw.a`
  text-channel-link bg-channel-link-background/[0.15] rounded-[3px] px-0.5 cursor-pointer
  hover:text-white hover:bg-channel-link-background/100`;
