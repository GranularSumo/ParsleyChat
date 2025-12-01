import { expect, test, vi, afterEach, beforeEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatInputArea from './ChatInputArea';

let mockSendMessage: (messageText: string) => void;

beforeEach(() => {
  mockSendMessage = vi.fn();
  render(<ChatInputArea sendMessage={mockSendMessage} />);
})

afterEach(() => {
  cleanup();
});

const getElements = () => ({
  textarea: screen.getByRole('textbox') as HTMLTextAreaElement,
  sendButton: screen.getByRole('button'),
});

test('when a user types text, it appears in the textarea', async () => {

  const { textarea } = getElements();

  await userEvent.type(textarea, 'Hello test');

  expect(textarea.value).toBe('Hello test');
});

test('when user presses Enter (without shift), message is sent and textarea is cleared', async () => {

  const { textarea } = getElements();
  await userEvent.type(textarea, 'Hello test');
  expect(textarea.value).toBe('Hello test');

  await userEvent.type(textarea, '{Enter}');

  expect(mockSendMessage).toHaveBeenCalledWith('Hello test');
  expect(mockSendMessage).toHaveBeenCalledOnce();
  expect(textarea.value).toBe('');

})

test('when user presses Enter (with shift), the message is not sent and textarea starts a new line', async () => {

  const { textarea } = getElements();

  await userEvent.type(textarea, 'Hello test{Shift>}{Enter}{/Shift}');
  expect(mockSendMessage).toHaveBeenCalledTimes(0);
  expect(textarea.value).toBe('Hello test\n');
})

test('when user clicks send the message is sent and the textarea is cleared', async () => {

  const { textarea, sendButton } = getElements();

  await userEvent.type(textarea, 'Hello test');


  await userEvent.click(sendButton);

  expect(mockSendMessage).toHaveBeenCalledWith('Hello test');
  expect(mockSendMessage).toHaveBeenCalledOnce();
  expect(textarea.value).toBe('');
})

test('when user tries to send empty message nothing should happen', async () => {


  const { textarea } = getElements();
  await userEvent.type(textarea, '{Enter}');

  expect(mockSendMessage).toHaveBeenCalledTimes(0);
})
